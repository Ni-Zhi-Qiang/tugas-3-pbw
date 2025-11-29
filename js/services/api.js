export async function loadData(url = '/data/dataBahanAjar.json') {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Gagal load data');
  return res.json();
}
