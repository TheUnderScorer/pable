resource "aws_route53_record" "app" {
  name    = "api"
  type    = "A"
  zone_id = var.dns_zone_id
  records = [join(",", data.aws_network_interface.networkinterfacesigserv[*].association[0].public_ip)]
  ttl = 300
}
