variable "aws_region" {
  default = "eu-west-1"
}

variable "dns_zone_id" {
  default = "Z00408931X4PHFVTCW5MH"
}

variable "domain" {
  default = "skryba.link"
}

variable "dns_name" {
  default = "skryba"
}

variable "dns_zone" {
  default = "skryba"
}

variable "image_tag" {
  default = "latest"
}

variable "api_repository" {
  default = "086627185220.dkr.ecr.eu-west-1.amazonaws.com/api_repo"
}

variable "cert" {
  default = ""
}

variable "cert_key" {
  default = ""
}

variable "client_subdomain" {
  default = "app.skryba.link"
}

variable "certificate_arn" {
  default = ""
}
