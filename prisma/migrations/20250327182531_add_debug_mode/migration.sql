-- AlterTable
ALTER TABLE "GlobalSettings" ADD COLUMN     "debugMode" JSONB DEFAULT '{"enabled": false, "webhookUrl": null, "logLevel": "basic", "includeMetadata": false}';
