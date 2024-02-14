
// import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

// const client = new SecretManagerServiceClient();

// export async function accessSecret() {
//     const secretName = "projects/418676732313/secrets/BYTEME_DEFAULT/versions/latest";
//     console.log(`secretName: ${secretName}`);
//     const clientsecretversion = client.getSecretVersion(secretName).catch((err) => { console.log(err) }).finally(() => { console.log("finally") });
//     // Access the secret version
//     console.log("client", clientsecretversion);
//     const [version] = await client.accessSecretVersion({
//         name: secretName,
//     });
//     console.log(`version: ${version}`);
//     // Extract the payload as a string
//     const payload = version.payload.data.toString('utf8');

//     // Here's your secret, handle it with care
//     console.log(`Shhh... the secret is: ${payload}`);
//     return payload;
// }

