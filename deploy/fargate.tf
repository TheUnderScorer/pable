resource "aws_ecs_task_definition" "api_task" {
  family = "api"

  // Fargate is a type of ECS that requires awsvpc network_mode
  requires_compatibilities = ["FARGATE"]
  network_mode = "awsvpc"

  // Valid sizes are shown here: https://aws.amazon.com/fargate/pricing/
  memory = "512"
  cpu = "256"

  // Fargate requires task definitions to have an execution role ARN to support ECR images
  execution_role_arn = aws_iam_role.ecs_role.arn

  container_definitions = <<EOT
[
    {
        "name": "skryba_api",
        "image": "${aws_ecr_repository.api_repo.repository_url}:latest",
        "memory": 512,
        "essential": true,
        "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                  "awslogs-region": "${var.aws_region}",
                  "awslogs-stream-prefix": "server",
                  "awslogs-group": "${aws_cloudwatch_log_group.api_logs.name}"
                }
        },
        "portMappings": [
            {
                "containerPort": 3000,
                "hostPort": 3000
            }
        ]
    }
]
EOT
}


resource "aws_ecs_cluster" "api_cluster" {
  name = "api_cluster"
}

resource "aws_ecs_service" "api_service" {
  name = "api_service"

  cluster = aws_ecs_cluster.api_cluster.id
  task_definition = aws_ecs_task_definition.api_task.arn

  launch_type = "FARGATE"
  desired_count = 1

  network_configuration {
    subnets = [
      aws_subnet.public_a.id, aws_subnet.public_b.id]
    security_groups = [
      aws_security_group.api_sg.id]
    assign_public_ip = true
  }

  load_balancer {
    container_name = "skryba_api"
    container_port = 3000
    target_group_arn = aws_lb_target_group.api_tg.arn
  }

  depends_on = [aws_lb_listener.api_http_forward]
}

resource "aws_cloudwatch_log_group" "api_logs" {
  name = "api-logs"
}
