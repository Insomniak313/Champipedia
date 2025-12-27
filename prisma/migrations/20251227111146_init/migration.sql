-- CreateTable
CREATE TABLE "Mushroom" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "commonNameFr" TEXT NOT NULL,
    "scientificName" TEXT NOT NULL,
    "family" TEXT,
    "edibilityStatus" TEXT NOT NULL,
    "capShape" TEXT,
    "capColor" TEXT,
    "hymenophoreType" TEXT,
    "sporePrintColor" TEXT,
    "hasRing" BOOLEAN NOT NULL DEFAULT false,
    "hasVolva" BOOLEAN NOT NULL DEFAULT false,
    "bruisingColor" TEXT,
    "habitat" TEXT,
    "seasonTags" TEXT,
    "description" TEXT,
    "warnings" TEXT,
    "imageUrl" TEXT
);

-- CreateIndex
CREATE INDEX "Mushroom_commonNameFr_idx" ON "Mushroom"("commonNameFr");

-- CreateIndex
CREATE INDEX "Mushroom_scientificName_idx" ON "Mushroom"("scientificName");

-- CreateIndex
CREATE INDEX "Mushroom_edibilityStatus_idx" ON "Mushroom"("edibilityStatus");

-- CreateIndex
CREATE INDEX "Mushroom_capColor_idx" ON "Mushroom"("capColor");

-- CreateIndex
CREATE INDEX "Mushroom_hymenophoreType_idx" ON "Mushroom"("hymenophoreType");

-- CreateIndex
CREATE INDEX "Mushroom_habitat_idx" ON "Mushroom"("habitat");
