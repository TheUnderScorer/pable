resource "aws_s3_bucket" "client_bucket" {
  bucket = var.client_subdomain
  acl = "public-read"

  website {
    index_document = "index.html"
    error_document = "index.html"
  }
}

resource "aws_s3_bucket_policy" "client_bucket_policy" {
  bucket = aws_s3_bucket.client_bucket.bucket
  policy = jsonencode({
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "AddPerm",
        Effect: "Allow",
        Principal: "*",
        Action: [
          "s3:GetObject"],
        Resource: [
          "arn:aws:s3:::${var.client_subdomain}/*"]
      }]
  })
}

output "bucket" {
  value = aws_s3_bucket.client_bucket.bucket
}
