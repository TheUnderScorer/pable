provider "aws" {
  region = var.aws_region
}

terraform {
  backend "remote" {
    organization = "Skryba"

    workspaces {
      name = "skryba-cli"
    }
  }
}

