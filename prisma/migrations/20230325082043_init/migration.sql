-- CreateTable
CREATE TABLE "ConnectedInstance" (
    "domain" TEXT NOT NULL PRIMARY KEY,
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "client_secret" TEXT NOT NULL,
    "vapid_key" TEXT NOT NULL
);
