output "alb_dns_name" {
  value = aws_lb.backend.dns_name
}

output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.main.domain_name
}

output "frontend_bucket_name" {
  value = aws_s3_bucket.frontend.bucket
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.main.name
}

output "rds_endpoint" {
  value = aws_db_instance.main.address
}

output "database_url_secret_arn" {
  value = aws_secretsmanager_secret.database_url.arn
}