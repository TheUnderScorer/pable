resource "aws_ecr_repository" "api_repo" {
  name = "api_repo"
}

resource "null_resource" "authorize_docker" {
  provisioner "local-exec" {
    command = <<EOF
      #!/bin/bash

      api_region="$(echo "${aws_ecr_repository.api_repo.repository_url}" | cut -d. -f4)"

      aws ecr get-login-password --region "$api_region" | docker login --username AWS --password-stdin ${aws_ecr_repository.api_repo.repository_url}

      echo "Autenthicated to API repository URL: ${aws_ecr_repository.api_repo.repository_url}"
      echo "In order to deploy run 'docker tag some-image ${aws_ecr_repository.api_repo.repository_url}:latest' and 'docker push ${aws_ecr_repository.api_repo.repository_url}:latest'"
    EOF
  }
}
