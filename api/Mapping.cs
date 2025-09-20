using System.Text.RegularExpressions;
using Purchase.Api.Models;

namespace Purchase.Api.Mapping;

public static class PropertyMapper
{
    public static InternalProperty NormalizeProperty(ExternalProperty p)
    {
        // 1) Full address
        var fullAddress = !string.IsNullOrWhiteSpace(p.formattedAddress)
            ? CollapseSpaces(p.formattedAddress!)
            : ComposeFromParts(p.addressParts);

        // 2) Volume/Folio
        var vol = NullIfEmpty(p.title?.volume);
        var fol = NullIfEmpty(p.title?.folio);
        var status = (!string.IsNullOrWhiteSpace(vol) && !string.IsNullOrWhiteSpace(fol))
            ? "KnownVolFol" : "UnknownVolFol";

        // 3) Lot/Plan carried through as-is
        var lotPlan = p.lotPlan is null ? null : new LotPlan(p.lotPlan.lot, p.lotPlan.plan);

        // 4) Source trace
        var trace = new SourceTrace(p.provider, p.requestId, p.receivedAt);

        return new InternalProperty(
            fullAddress,
            lotPlan,
            new VolumeFolio(vol, fol),
            status,
            trace
        );
    }

    private static string ComposeFromParts(AddressParts? a)
    {
        if (a is null) return string.Empty;
        var street = a.street?.Trim() ?? string.Empty;
        var suburb = a.suburb?.Trim() ?? string.Empty;
        var state  = a.state?.Trim()  ?? string.Empty;
        var post   = a.postcode?.Trim() ?? string.Empty;
        var composed = string.Join(" ", new[]
        {
            string.Join(", ", new[]{ street }.Where(s => !string.IsNullOrWhiteSpace(s))),
            string.Join(" ", new[]{ suburb, state, post }.Where(s => !string.IsNullOrWhiteSpace(s)))
        }.Where(s => !string.IsNullOrWhiteSpace(s)));
        return CollapseSpaces(composed);
    }

    private static string? NullIfEmpty(string? s)
        => string.IsNullOrWhiteSpace(s) ? null : s;

    private static string CollapseSpaces(string s)
        => Regex.Replace(s.Trim(), @"\s+", " ");
}
