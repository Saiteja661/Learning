# Final Verification Checklist

Before triggering production deploy, verify the following:

- [ ] Create S3 bucket `expense-tracker-terraform-state-saiteja` and DynamoDB table `expense-tracker-terraform-locks` in the target AWS account/region.
- [ ] Populate `infra/terraform.tfvars` with real secrets (DB password, JWT secret, `ecr_image_url`). Do not commit this file.
- [ ] Add the GitHub repository secrets listed in DEPLOYMENT.md/README (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, etc.).
- [ ] Run `terraform init -backend-config=backend.hcl` then `terraform apply -var-file=terraform.tfvars` from `infra/`.
- [ ] Ensure ECR repo exists or let CI create it; confirm `ECR_REPOSITORY` secret matches repository name.
- [ ] Push to `main` to trigger CI: monitor Actions → CI, then Deploy workflows.
- [ ] After deploy, check ECS task logs and ALB health checks. Verify `/health` responds.
- [ ] Verify frontend served from CloudFront — test login/register flow and expense create/list.
