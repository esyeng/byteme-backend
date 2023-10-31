// app.d.ts
/// <reference types="lucia" />
declare namespace Lucia {
	type Auth = import("./src/auth.ts").Auth;
	type DatabaseUserAttributes = {};
	type DatabaseSessionAttributes = {};
}
