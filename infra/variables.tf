variable "aws_region"       { default = "ap-south-1" }
variable "project_name"     { default = "expense-tracker" }
variable "db_username"      { default = "expenseuser" }
variable "db_password"      { sensitive = true }
variable "ecr_image_url"    { description = "Full ECR image URI including tag" }
