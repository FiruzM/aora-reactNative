import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
  Storage,
} from "react-native-appwrite";

export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.jsm.aora",
  projecttId: "66dfd6550006af4cffde",
  databaseId: "66dfd9040033404c2fe0",
  userCollectionId: "66dfd92d00025b239595",
  videosCpllectionId: "66dfd95a002efb19c557",
  storageId: "66dfdaa5002570127d30",
};

const client = new Client();
client
  .setEndpoint(config.endpoint)
  .setProject(config.projecttId)
  .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        username,
        email,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (err: Error | any) {
    console.log(err);
    throw new Error(err);
  }
};

export async function signIn(email: string, password: string) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (err: Error | any) {
    throw new Error(err);
  }
}

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (err: Error | any) {
    throw new Error(err);
  }
};

export const getAllPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videosCpllectionId,
      [Query.orderDesc("$createdAt")]
    );

    return posts;
  } catch (err: Error | any) {
    throw new Error(err);
  }
};

export const getLatestPosts = async () => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videosCpllectionId,
      //@ts-ignore
      [Query.orderDesc("$createdAt", Query.limit(7))]
    );

    return posts;
  } catch (err: Error | any) {
    throw new Error(err);
  }
};

export const searchtPosts = async (query: string) => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videosCpllectionId,
      [Query.search("title", query)]
    );

    return posts;
  } catch (err: Error | any) {
    throw new Error(err);
  }
};

export const getUserId = async (userId: string) => {
  try {
    const posts = await databases.listDocuments(
      config.databaseId,
      config.videosCpllectionId,
      [Query.equal("creator", userId)]
    );

    return posts;
  } catch (err: Error | any) {
    throw new Error(err);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (err: Error | any) {
    throw new Error(err);
  }
};

const getFilePreview = async (fileId, type) => {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(config.storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        config.storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw new Error("File not found");

    return fileUrl;
  } catch (err: Error | any) {
    throw new Error(err);
  }
};

export const uploadFile = async (file, type) => {
  const asset = {
    name: file.name,
    type: file.mimeType,
    size: file.size,
    uri: file.uri,
  };

  try {
    const uploadFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadFile.$id, type);
    return fileUrl;
  } catch (err: Error | any) {
    throw new Error(err);
  }
};

export const createVideo = async (form: any) => {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(form.thumbnail, "image"),
      uploadFile(form.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      config.databaseId,
      config.videosCpllectionId,
      ID.unique(),
      {
        title: form.title,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        prompt: form.prompt,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (err: Error | any) {
    throw new Error(err);
  }
};
