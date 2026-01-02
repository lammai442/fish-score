# from .table import get_dynamodb_table
# from botocore.exceptions import ClientError

# def getUserByEmail(email):
#     table = get_dynamodb_table()

#     item = {
#         "PK": f"USER#user-{user_id}",
#         "SK": "PROFILE",
#         "entityType": "USER",
#         "email": email,
#         "firstName": first_name,
#         "lastName": last_name,
#         "createdAt": now,
#         "totalCatchWeight": 0,
#         "maxCatchWeight": 0,
#     }

#     try:
#         table.put_item(Item=item, ConditionExpression="attribute_not_exists(PK)")
#     except ClientError as e:
#         if e.respons["Error"]["Code"] == "ConditionalCheckFailedException":
#             # Om användaren redan finns
#             return {"error": "User already exists"}
#         else:
#             return {"error": str(e)}

#     return {"userId": f"user-{user_id}", "email": email}
