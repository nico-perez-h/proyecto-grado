export function formatFechaBonita(fechaISO: string) {
  const fecha = new Date(fechaISO);
  const fechaAjustada = new Date(fecha.getTime() - 4 * 60 * 60 * 1000);

  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(fechaAjustada);
}
