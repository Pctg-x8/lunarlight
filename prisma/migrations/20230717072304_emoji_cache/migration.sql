-- CreateTable
CREATE TABLE "RemoteEmoji" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "domain" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "asset_url" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "RemoteEmoji_domain_name_key" ON "RemoteEmoji"("domain", "name");
