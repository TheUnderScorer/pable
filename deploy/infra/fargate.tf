resource "aws_ecs_task_definition" "api_task" {
  lifecycle {
    create_before_destroy = true
  }

  family = "api"

  // Fargate is a type of ECS that requires awsvpc network_mode
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"

  // Valid sizes are shown here: https://aws.amazon.com/fargate/pricing/
  memory = "512"
  cpu    = "256"

  // Fargate requires task definitions to have an execution role ARN to support ECR images
  execution_role_arn = aws_iam_role.ecs_role.arn
  container_definitions = jsonencode([
    {
      name : "skryba_api",
      image : "${var.api_repository}:${var.image_tag}",
      memory : 512,
      essential : true,
      logConfiguration : {
        "logDriver" : "awslogs",
        "options" : {
          "awslogs-region" : var.aws_region,
          "awslogs-stream-prefix" : "server",
          "awslogs-group" : aws_cloudwatch_log_group.api_logs.name
        }
      },
      portMappings : [
        {
          containerPort : 443,
          hostPort : 443
        }
      ],
      environment : [
        {
          name : "PORT",
          value : "443"
        },
        {
          name : "CERT",
          value : var.cert
        },
        {
          name : "CERT_KEY",
          value : var.cert_key
        },
        {
          name : "VERSION",
          value : var.image_tag
        }
      ]
    }
    ]
  )
}


resource "aws_ecs_cluster" "api_cluster" {
  name = "api_cluster"
}

resource "aws_ecs_service" "api_service" {
  lifecycle {
    create_before_destroy = true
  }

  tags = {
    image = var.image_tag
  }

  name = "api_service"

  cluster         = aws_ecs_cluster.api_cluster.id
  task_definition = aws_ecs_task_definition.api_task.arn

  launch_type   = "FARGATE"
  desired_count = 1

  deployment_minimum_healthy_percent = 0
  deployment_maximum_percent         = 200

  force_new_deployment = true

  wait_for_steady_state = true

  network_configuration {
    subnets = [
    aws_subnet.public_a.id, aws_subnet.public_b.id]
    security_groups = [
    aws_security_group.api_sg.id]
    assign_public_ip = true
  }
}

resource "aws_cloudwatch_log_group" "api_logs" {
  name = "api-logs"
}


resource "time_sleep" "sigserv_60_seconds" {
  depends_on = [aws_ecs_service.api_service]

  create_duration = "60s"
}

data "aws_network_interfaces" "all_network_interfaces" {
  depends_on = [time_sleep.sigserv_60_seconds]
}

data "aws_network_interfaces" "networkinterfacesigserv" {
  depends_on = [time_sleep.sigserv_60_seconds]

  filter {
    name   = "group-id"
    values = [aws_security_group.api_sg.id]
  }
}

data "aws_network_interface" "networkinterfacesigserv" {
  id = join(",", data.aws_network_interfaces.networkinterfacesigserv.ids)
}


output "ecs_privateipv4_sigserv" {
  value = data.aws_network_interface.networkinterfacesigserv.private_ip
}

output "ecs_publicipv4_sigserv" {
  value = join(",", data.aws_network_interface.networkinterfacesigserv[*].association[0].public_ip)
}

output "ecs_serv_data" {
  value = data.aws_network_interface.networkinterfacesigserv
}

output "ecs_serv_interfaces" {
  value = data.aws_network_interfaces.networkinterfacesigserv
}

output "ecs_serv_interfaces_str" {
  value = jsonencode(data.aws_network_interfaces.networkinterfacesigserv)
}

output "all_network_interfaces" {
  value = jsonencode(data.aws_network_interfaces.all_network_interfaces)
}
