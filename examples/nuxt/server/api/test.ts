
import jwt from "jsonwebtoken";

const apiKey = "978c2784-af39-4342-8c3f-167fa273d12e";
const clientId = "9517c581-eac3-488f-980a-840db90c9a08"

export default defineEventHandler(async (event) => {
	const token = jwt.sign({
		appId: "51d3732f-70e2-4a19-9b36-868dd6c30530",
		contentType: "image/jpeg",
		filename: "9bbecc34ed2c088d68c3f4954eba3f28.jpeg",
		size: 221263,
		clientId
	}, apiKey, {
		expiresIn: "5m"
	})

	return token;

	// const apiClient = createApiClient({ apiKey });

	// const response = await apiClient.file.createPresignedUrl.mutate({
	// 	appId: "51d3732f-70e2-4a19-9b36-868dd6c30530",
	// 	contentType: "image/jpeg",
	// 	filename: "9bbecc34ed2c088d68c3f4954eba3f28.jpeg",
	// 	size: 221263,
	// });

	// return response;
});
