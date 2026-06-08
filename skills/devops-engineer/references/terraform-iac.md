------
{% raw %}
----|----------------|
| State locking | S3 backend with DynamoDB |
| Secrets | Use AWS Secrets Manager / SSM |
| Modules | Reusable components |
| Workspaces | Environment separation |
| Tagging | Consistent resource tags |
| Validation | `terraform validate`, `tflint` |

## Common Commands

```bash
terraform init
terraform plan -out=tfplan
terraform apply tfplan
terraform destroy
terraform state list
terraform import aws_instance.app i-1234567890
```
{% endraw %}
