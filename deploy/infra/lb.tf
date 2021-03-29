resource "aws_route53_record" "cert_validation" {
  allow_overwrite = true
  name            = tolist(aws_acm_certificate.app_cert.domain_validation_options)[0].resource_record_name
  records         = [tolist(aws_acm_certificate.app_cert.domain_validation_options)[0].resource_record_value]
  type            = tolist(aws_acm_certificate.app_cert.domain_validation_options)[0].resource_record_type
  zone_id         = var.dns_zone_id
  ttl             = 60
}

# This tells terraform to cause the route53 validation to happen
resource "aws_acm_certificate_validation" "cert" {
  certificate_arn         = aws_acm_certificate.app_cert.arn
  validation_record_fqdns = [aws_route53_record.cert_validation.fqdn]
}

resource "aws_route53_record" "app" {
  name    = "api"
  type    = "A"
  zone_id = var.dns_zone_id
  records = [join(",", data.aws_network_interface.networkinterfacesigserv[*].association[0].public_ip)]
  ttl = 300
}

resource "aws_acm_certificate" "app_cert" {
  domain_name               = aws_route53_record.app.fqdn
  subject_alternative_names = ["*.${aws_route53_record.app.fqdn}"]
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

output "lb" {
  value = "App urlL: https://${aws_route53_record.app.fqdn}"
}
