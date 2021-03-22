ALTER table Version add COLUMN last_seen bigint(20);
ALTER table Version add COLUMN version_index int (3);
UPDATE Version set version_index = 1;
