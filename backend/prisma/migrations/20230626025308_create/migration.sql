-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "currentTurnPlayerId" TEXT NOT NULL DEFAULT '',
    "gameStarted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PositionPlayer" (
    "playerId" TEXT NOT NULL,
    "positionX" INTEGER NOT NULL,
    "positionY" INTEGER NOT NULL,
    "roomId" TEXT,

    CONSTRAINT "PositionPlayer_pkey" PRIMARY KEY ("playerId")
);

-- CreateTable
CREATE TABLE "_players" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PositionPlayer_playerId_key" ON "PositionPlayer"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "_players_AB_unique" ON "_players"("A", "B");

-- CreateIndex
CREATE INDEX "_players_B_index" ON "_players"("B");

-- AddForeignKey
ALTER TABLE "PositionPlayer" ADD CONSTRAINT "PositionPlayer_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_players" ADD CONSTRAINT "_players_A_fkey" FOREIGN KEY ("A") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_players" ADD CONSTRAINT "_players_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
