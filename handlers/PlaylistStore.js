const MAX_TRACKS_PER_PLAYLIST = 500;

/**
 * Kullanıcı çalma listelerini JoshDB (client.music) üzerinde depolamak için yardımcı araçlar.
 * Veri Yapısı (Her sunucu için):
 * anahtar: `${guildId}.playlists.${userId}` -> { [listeAdi: string]: Array<Track> }
 */
module.exports = {
  /**
   * Kullanıcının tüm çalma listelerini getirir, yoksa boş bir obje oluşturur.
   */
  async getAll(client, guildId, userId) {
    const key = `${guildId}.playlists.${userId}`;
    await client.music.ensure(key, {});
    return (await client.music.get(key)) || {};
  },

  /**
   * isme duyarsız (case-insensitive) arama yaparak tek bir çalma listesini getirir.
   */
  async get(client, guildId, userId, name) {
    const all = await this.getAll(client, guildId, userId);
    const entry = Object.entries(all).find(([n]) => n.toLowerCase() === String(name).toLowerCase());
    return entry ? { name: entry[0], tracks: entry[1] || [] } : null;
  },

  /** Yeni bir çalma listesi oluşturur. */
  async create(client, guildId, userId, name) {
    const key = `${guildId}.playlists.${userId}`;
    const all = await this.getAll(client, guildId, userId);
    if (!all[name]) {
      all[name] = [];
      await client.music.set(key, all);
    }
    return { name, tracks: all[name] };
  },

  /** Bir çalma listesine bir veya birden fazla şarkı ekler. */
  async addTracks(client, guildId, userId, name, tracks) {
    const key = `${guildId}.playlists.${userId}`;
    const all = await this.getAll(client, guildId, userId);
    const existing = all[name] || [];
    
    
    const seen = new Set(
      existing.map((t) => (t?.url ? `u:${t.url}` : `n:${(t?.name || '').toLowerCase()}|${t?.duration || 0}`))
    );
    const filtered = [];
    for (const t of tracks) {
      const keyStr = t?.url ? `u:${t.url}` : `n:${(t?.name || '').toLowerCase()}|${t?.duration || 0}`;
      if (seen.has(keyStr)) continue;
      seen.add(keyStr);
      filtered.push(t);
      if (existing.length + filtered.length >= MAX_TRACKS_PER_PLAYLIST) break;
    }
    const merged = existing.concat(filtered).slice(0, MAX_TRACKS_PER_PLAYLIST);
    all[name] = merged;
    await client.music.set(key, all);
    return merged.length;
  },

  /** Sıra numarasına göre listeden şarkı siler. */
  async removeTrack(client, guildId, userId, name, index1) {
    const key = `${guildId}.playlists.${userId}`;
    const all = await this.getAll(client, guildId, userId);
    const list = all[name] || [];
    const idx = Number(index1) - 1;
    if (idx < 0 || idx >= list.length) return null;
    const [removed] = list.splice(idx, 1);
    all[name] = list;
    await client.music.set(key, all);
    return removed || null;
  },

  /** Çalma listesini tamamen siler. */
  async delete(client, guildId, userId, name) {
    const key = `${guildId}.playlists.${userId}`;
    const all = await this.getAll(client, guildId, userId);
    if (!all[name]) return false;
    delete all[name];
    await client.music.set(key, all);
    return true;
  },

  /** Çalma listesinin adını değiştirir. */
  async rename(client, guildId, userId, oldName, newName) {
    const key = `${guildId}.playlists.${userId}`;
    const all = await this.getAll(client, guildId, userId);
    if (!all[oldName]) return false;
    if (all[newName]) return false; 
    all[newName] = all[oldName];
    delete all[oldName];
    await client.music.set(key, all);
    return true;
  },

  /** DisTube şarkı objesini veri tabanına uygun sade bir objeye dönüştürür. */
  serializeSong(song, user) {
    if (!song) return null;
    return {
      name: song.name || song.playlist?.name || "Bilinmiyor",
      url: song.url,
      duration: song.duration || 0,
      formattedDuration: song.formattedDuration || null,
      thumbnail: song.thumbnail || null,
      uploader: song.uploader?.name || null,
      source: song.source || null,
      requestedBy: user?.id || null,
      savedAt: Date.now(),
    };
  },
};
