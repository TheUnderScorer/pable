resource "aws_ecr_repository" "api_repo" {
  name = "api_repo"
}
output "ecr-url" {
  value = "In order to deploy run 'docker tag some-image ${aws_ecr_repository.api_repo.repository_url}:latest' and 'docker push ${aws_ecr_repository.api_repo.repository_url}:latest'"
}

output "ecr-auth" {
  value = <<EOT

  In order to authorize to ECS run:
  ACCOUNT_ID=$(aws sts get-caller-identity | jq -r ".Account")
  aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.eu-west-1.amazonaws.com"
EOT
}
