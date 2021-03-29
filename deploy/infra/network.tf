resource "aws_vpc" "app_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
}

resource "aws_subnet" "public_a" {
  vpc_id            = aws_vpc.app_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "${var.aws_region}a"
}

resource "aws_subnet" "public_b" {
  vpc_id            = aws_vpc.app_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "${var.aws_region}b"
}

resource "aws_internet_gateway" "internet_gateway" {
  vpc_id = aws_vpc.app_vpc.id
}

resource "aws_route" "internet_access" {
  route_table_id         = aws_vpc.app_vpc.main_route_table_id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.internet_gateway.id
}

resource "aws_security_group" "api_sg" {
  name        = "security_group_app"
  description = "Allow TLS inbound traffic"
  vpc_id      = aws_vpc.app_vpc.id

  ingress {
    from_port       = "80"
    to_port         = "80"
    protocol        = "tcp"
    cidr_blocks     = ["0.0.0.0/0"]
  }

  ingress {
    from_port       = "443"
    to_port         = "443"
    protocol        = "tcp"
    cidr_blocks     = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}


resource "aws_eip" "eip_manager" {
  vpc = true
}

output "eip" {
  value = {
    public_ip = aws_eip.eip_manager.public_ip
    private_ip = aws_eip.eip_manager.private_ip
  }
}
