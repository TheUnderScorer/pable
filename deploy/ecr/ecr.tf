resource "aws_ecr_repository" "api_repo" {
  name = "api_repo"
}

resource "aws_ecr_lifecycle_policy" "api_repo_policy" {
  repository = aws_ecr_repository.api_repo.name

  policy = <<EOF
{
  "rules": [
    {
      "rulePriority": 2,
      "description": "Keep last 2 any images",
      "selection": {
        "tagStatus": "any",
        "countType": "imageCountMoreThan",
        "countNumber": 2
      },
      "action": {
        "type": "expire"
      }
    }
  ]
}
EOF
}

output "ecr-url" {
  value = "In order to deploy run 'docker tag some-image ${aws_ecr_repository.api_repo.repository_url}:${var.image_tag}' and 'docker push ${aws_ecr_repository.api_repo.repository_url}:${var.image_tag}'"
}

output "ecr-auth" {
  value = <<EOT

  In order to authorize to ECS run:
  ACCOUNT_ID=$(aws sts get-caller-identity | jq -r ".Account")
  aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.eu-west-1.amazonaws.com"
EOT
}
