variable "aws_region" {
  default = "ap-south-1"
}

variable "project_name" {
  default = "expense-tracker"
}

variable "db_name" {
  default = "expensedb"
}

variable "db_username" {
  default = "expenseuser"
}

variable "db_password" {
  sensitive = true
}

variable "jwt_secret" {
  sensitive   = true
  description = "JWT signing secret used by the backend container"
}

variable "ecr_image_url" {
  description = "Full ECR image URI including tag"
}

variable "ecs_cpu" {
  default = "256"
}

variable "ecs_memory" {
  default = "512"
}

variable "ecs_desired_count" {
  default = 1
}
