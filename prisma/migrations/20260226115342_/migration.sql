-- DropForeignKey
ALTER TABLE "Quotation" DROP CONSTRAINT "Quotation_clientId_fkey";

-- DropForeignKey
ALTER TABLE "Quotation" DROP CONSTRAINT "Quotation_organizationId_fkey";

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "type" TEXT DEFAULT 'Regular';

-- AlterTable
ALTER TABLE "Quotation" ALTER COLUMN "clientId" DROP NOT NULL,
ALTER COLUMN "organizationId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quotation" ADD CONSTRAINT "Quotation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;
