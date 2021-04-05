ALTER table Version add COLUMN last_seen bigint(20);
ALTER table Version add COLUMN version_number int (3);
UPDATE Version set version_number = 1;
