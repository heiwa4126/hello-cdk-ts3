import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { format } from "date-fns";

export const lambdaHandler = async (event, context) => {
	const bucketName = process.env.MyBucketName;

	const s3Client = new S3Client({ region: process.env.MyBucketRegion }); // Replace with your desired region

	const currentDate = format(new Date(), "yyyy-MM-dd-HH-mm-ss");
	const key = `${currentDate}.txt`;
	const body = "hello";

	const params = {
		Bucket: bucketName,
		Key: key,
		Body: body,
	};

	let response;

	try {
		const command = new PutObjectCommand(params);
		const res = await s3Client.send(command);
		response = {
			statusCode: 200,
			body: JSON.stringify({
				message: "Object created successfully",
				response: res,
			}),
		};
	} catch (error) {
		response = {
			statusCode: 400,
			body: JSON.stringify({
				message: "Error creating object:",
				error,
			}),
		};
	}

	return response;
};
