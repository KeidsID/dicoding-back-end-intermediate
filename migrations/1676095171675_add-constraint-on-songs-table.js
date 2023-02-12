const {ALBUMS_STR, SONGS_STR} = require('../src/common/constants');

const FK_SONGS_ALBUM_ID = 'fk_songs.album_id_albums.id';
const FN_ALBUM_ID_SET_DEFAULT = 'fn_album_id_set_default';
const TGR_ALBUM_ID = 'tgr_album_id';

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql(`
    INSERT INTO ${ALBUMS_STR}(id, name, year)
    VALUES('album-unknown', 'Unknown', 1945)
  `.trim(),
  );

  pgm.sql(`
    UPDATE ${SONGS_STR} SET album_id = 'album-unknown' 
    WHERE album_id IS NULL
  `.trim(),
  );

  pgm.sql(`
    ALTER TABLE ${SONGS_STR}
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

  pgm.createTrigger(SONGS_STR, TGR_ALBUM_ID, {
    when: 'BEFORE', operation: ['INSERT', 'UPDATE'],
    level: 'ROW',
    function: FN_ALBUM_ID_SET_DEFAULT, functionParams: [],
  });

  pgm.addConstraint(SONGS_STR, FK_SONGS_ALBUM_ID, `
    FOREIGN KEY(album_id) REFERENCES ${ALBUMS_STR}(id) 
    ON DELETE SET DEFAULT
  `.trim(),
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint(SONGS_STR, FK_SONGS_ALBUM_ID);

  pgm.dropTrigger(SONGS_STR, TGR_ALBUM_ID);

  pgm.dropFunction(FN_ALBUM_ID_SET_DEFAULT, []);

  pgm.alterColumn(SONGS_STR, 'album_id', {
    default: null,
  });

  pgm.sql(`
    UPDATE ${SONGS_STR} SET album_id = NULL
    WHERE album_id = 'album-unknown'
  `.trim(),
  );

  pgm.sql(`DELETE FROM ${ALBUMS_STR} WHERE id = 'album-unknown'`);
};
