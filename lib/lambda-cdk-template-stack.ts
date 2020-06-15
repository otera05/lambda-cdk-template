import * as cdk from "@aws-cdk/core";
import * as apigateway from "@aws-cdk/aws-apigateway";
import * as lambda from "@aws-cdk/aws-lambda";
import * as path from "path";

export class LambdaCdkTemplateStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // Lambda function
    const templateFunction: lambda.Function = new lambda.Function(
      this,
      "templateLambda",
      {
        functionName: "templateLambda",
        code: lambda.Code.fromAsset(
          path.join(__dirname, "template-lambda-handler")
        ),
        handler: "templateHandler",
        runtime: lambda.Runtime.GO_1_X,
      }
    );

    // API Gateway
    const restApi: apigateway.RestApi = new apigateway.RestApi(
      this,
      "templateApiGateway",
      {}
    );

    // Lambda integration
    const lambdaIntegration: apigateway.LambdaIntegration = new apigateway.LambdaIntegration(
      templateFunction,
      {
        proxy: true,
      }
    );

    // add resource
    const books: apigateway.Resource = restApi.root.addResource("books");
    books.addMethod("GET", lambdaIntegration);
    books.addMethod("POST", lambdaIntegration);

    const book: apigateway.Resource = books.addResource("{book-id}");
    book.addMethod("GET", lambdaIntegration);
    book.addMethod("DELETE", lambdaIntegration);
  }
}
