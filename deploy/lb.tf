resource "aws_route53_zone" "public" {
  name = var.dns_zone
}

resource "aws_security_group" "app_lb_sg" {
  name        = "app_lb"
  description = "controls access to the Application Load Balancer (ALB)"
  vpc_id = aws_vpc.app_vpc.id

  # API Access
  ingress {
    protocol    = "tcp"
    from_port   = 80
    to_port     = 80
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_lb" "app_lb" {
  name = "skryba-api"
  subnets = [aws_subnet.public_a.id, aws_subnet.public_b.id]
  load_balancer_type = "application"
  security_groups = [aws_security_group.app_lb_sg.id]

  tags = {
    Application = "Skryba"
  }
}

resource "aws_lb_target_group" "api_tg" {
  name = "api-tg"
  port = 80
  protocol = "HTTPS"
  vpc_id = aws_vpc.app_vpc.id
  target_type = "ip"

  health_check {
    matcher = "200"
    path = "/health"
  }
}

resource "aws_route53_record" "cert_validation" {
  allow_overwrite = true
  name = tolist(aws_acm_certificate.app_cert.domain_validation_options)[0].resource_record_name
  records = [tolist(aws_acm_certificate.app_cert.domain_validation_options)[0].resource_record_value]
  type = tolist(aws_acm_certificate.app_cert.domain_validation_options)[0].resource_record_type
  zone_id = aws_route53_zone.public.zone_id
  ttl = 60
}

# This tells terraform to cause the route53 validation to happen
resource "aws_acm_certificate_validation" "cert" {
  certificate_arn         = aws_acm_certificate.app_cert.arn
  validation_record_fqdns = [ aws_route53_record.cert_validation.fqdn ]
}

resource "aws_route53_record" "app" {
  name = aws_route53_zone.public.name
  type = "A"
  zone_id = aws_route53_zone.public.zone_id

  alias {
    evaluate_target_health = false
    name = aws_lb.app_lb.dns_name
    zone_id = aws_lb.app_lb.zone_id
  }
}

resource "aws_acm_certificate" "app_cert" {
  domain_name = aws_route53_record.app.fqdn
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_lb_listener_certificate" "app_lb_certificate" {
  certificate_arn = aws_acm_certificate.app_cert.arn
  listener_arn = aws_lb_listener.api_http_forward.arn
}

resource "aws_lb_listener" "api_http_forward" {
  load_balancer_arn = aws_lb.app_lb.arn
  port = 80
  protocol = "HTTPS"

  default_action {
    type = "forward"
    target_group_arn = aws_lb_target_group.api_tg.arn
  }
}

output "lb" {
  value = "App urlL: https://${aws_route53_record.app.fqdn}"
}
