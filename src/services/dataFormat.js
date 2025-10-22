
export function formatarData(dataString) {

    if (!dataString) return null;

    // Se já está no formato completo YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(dataString)) {
        return dataString;
    }

    // Se é só o ano: "2004" -> "2004-01-01"
    if (/^\d{4}$/.test(dataString)) {
        return `${dataString}-01-01`;
    }

    // Se é ano-mês: "2004-05" -> "2004-05-01"
    if (/^\d{4}-\d{2}$/.test(dataString)) {
        return `${dataString}-01`;
    }
}