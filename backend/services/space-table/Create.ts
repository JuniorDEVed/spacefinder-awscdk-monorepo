import { v4 } from "uuid"
import { DynamoDB } from "aws-sdk"
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda"

const dynamodb = new DynamoDB.DocumentClient()

async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  let result: APIGatewayProxyResult = {
    statusCode: 200,
    body: "Hello from DynamoDB",
  }

  const item = typeof event.body == "object" ? event.body : JSON.parse(event.body)
  item.spaceId = v4()

  const params = {
    TableName: "SpacesTable",
    Item: item,
  }

  try {
    await dynamodb.put(params).promise()
  } catch (error) {
    result = {
      statusCode: 500,
      body: error.message,
    }
  }

  result.body = JSON.stringify(`Created item with id: , ${item.spaceId}`)

  return result
}

export { handler }
