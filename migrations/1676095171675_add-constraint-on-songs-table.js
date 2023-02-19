const DbTables = require('../src/common/utils/DbTables');

const FK_SONGS_ALBUM_ID = 'fk_songs.album_id_albums.id';
const FN_ALBUM_ID_SET_DEFAULT = 'fn_album_id_set_default';
const TGR_ALBUM_ID = 'tgr_album_id';

exports.up = (pgm) => {
  pgm.sql(`
    INSERT INTO ${DbTables.albums}(id, name, year)
    VALUES('album-unknown', 'Unknown', 1945)
  `.trim(),
  );

  pgm.sql(`
    UPDATE ${DbTables.songs} SET album_id = 'album-unknown' 
    WHERE album_id IS NULL
  `.trim(),
  );

  pgm.sql(`
    ALTER TABLE ${DbTables.songs}
    ALTER album_id SET DEFAULT 'album-unknown'
  `.trim(),
  );

  pgm.createFunction(FN_ALBUM_ID_SET_DEFAULT, [], {
    returns: 'TRIGGER', language: 'plpgsql',
  }, `BEGIN
    IF NEW.album_id IS NULL THEN
      NEW.album_id := 'album-unknown';
    END IF;

    RETURN NEW;
  END;`.trim(),
  );

  pgm.createTrigger(DbTables.songs, TGR_ALBUM_ID, {
    when: 'BEFORE', operation: ['INSERT', 'UPDATE'],
    level: 'ROW',
    function: FN_ALBUM_ID_SET_DEFAULT, functionParams: [],
  });

  pgm.addConstraint(DbTables.songs, FK_SONGS_ALBUM_ID, `
    FOREIGN KEY(album_id) REFERENCES ${DbTables.albums}(id) 
    ON DELETE SET DEFAULT
  `.trim(),
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint(DbTables.songs, FK_SONGS_ALBUM_ID);

  pgm.dropTrigger(DbTables.songs, TGR_ALBUM_ID);

  pgm.dropFunction(FN_ALBUM_ID_SET_DEFAULT, []);

  pgm.alterColumn(DbTables.songs, 'album_id', {
    default: null,
  });

  pgm.sql(`
    UPDATE ${DbTables.songs} SET album_id = NULL
    WHERE album_id = 'album-unknown'
  `.trim(),
  );

  pgm.sql(`DELETE FROM ${DbTables.albums} WHERE id = 'album-unknown'`);
};
