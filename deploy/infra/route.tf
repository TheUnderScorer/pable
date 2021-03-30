resource "aws_route53_record" "app" {
  name    = "api"
  type    = "A"
  zone_id = var.dns_zone_id
  records = [join(",", data.aws_network_interface.networkinterfacesigserv[*].association[0].public_ip)]
  ttl     = 300
}

resource "aws_route53_record" "frontend" {
  name = "app"
  type = "A"
  zone_id = var.dns_zone_id

  alias {
    name = aws_cloudfront_distribution.fronted_cloudfront.domain_name
    zone_id = aws_cloudfront_distribution.fronted_cloudfront.hosted_zone_id
    evaluate_target_health = false
  }
}
