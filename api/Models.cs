namespace Purchase.Api.Models;

public record AddressParts(string? street, string? suburb, string? state, string? postcode);
public record LotPlan(string? lot, string? plan);
public record Title(string? volume, string? folio);

public record ExternalProperty(
    string? provider,
    string? requestId,
    DateTimeOffset? receivedAt,
    AddressParts? addressParts,
    string? formattedAddress,
    LotPlan? lotPlan,
    Title? title,
    object? extra = null
);

public record VolumeFolio(string? volume, string? folio);

public record SourceTrace(string? provider, string? requestId, DateTimeOffset? receivedAt);

public record InternalProperty(
    string fullAddress,
    LotPlan? lotPlan,
    VolumeFolio volumeFolio,
    string status,
    SourceTrace sourceTrace
);
