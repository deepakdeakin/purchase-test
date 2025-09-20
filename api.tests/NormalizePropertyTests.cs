using Purchase.Api.Mapping;
using Purchase.Api.Models;
using Xunit;

public class NormalizePropertyTests
{
    [Fact]
    public void KnownVolFol_SetsStatusKnown()
    {
        var ext = new ExternalProperty(
            provider: "VIC-DDP",
            requestId: "REQ-1",
            receivedAt: DateTimeOffset.Parse("2025-08-30T03:12:45Z"),
            addressParts: new AddressParts("10 Example St", "Carlton", "VIC", "3053"),
            formattedAddress: null,
            lotPlan: new LotPlan("12", "PS123456"),
            title: new Title("123", "456")
        );
        var result = PropertyMapper.NormalizeProperty(ext);
        Assert.Equal("KnownVolFol", result.status);
        Assert.Equal("123", result.volumeFolio.volume);
        Assert.Equal("456", result.volumeFolio.folio);
    }

    [Fact]
    public void UnknownVolFol_WhenMissingOrEmpty()
    {
        var ext = new ExternalProperty(
            provider: "VIC-DDP",
            requestId: "REQ-2",
            receivedAt: DateTimeOffset.Parse("2025-08-30T03:12:45Z"),
            addressParts: new AddressParts("10 Example St", "Carlton", "VIC", "3053"),
            formattedAddress: null,
            lotPlan: new LotPlan("12", "PS123456"),
            title: new Title("", null)
        );
        var result = PropertyMapper.NormalizeProperty(ext);
        Assert.Equal("UnknownVolFol", result.status);
        Assert.Null(result.volumeFolio.volume);
        Assert.Null(result.volumeFolio.folio);
    }

    [Fact]
    public void ComposesAddress_WhenFormattedMissing()
    {
        var ext = new ExternalProperty(
            provider: null,
            requestId: null,
            receivedAt: null,
            addressParts: new AddressParts("10 Example St", "Carlton", "VIC", "3053"),
            formattedAddress: null,
            lotPlan: null,
            title: null
        );
        var result = PropertyMapper.NormalizeProperty(ext);
        Assert.Equal("10 Example St, Carlton VIC 3053", result.fullAddress);
    }

    [Fact]
    public void UsesFormattedAddress_WhenPresent_AndCollapsesSpaces()
    {
        var ext = new ExternalProperty(
            provider: null,
            requestId: null,
            receivedAt: null,
            addressParts: null,
            formattedAddress: "  10  Example   St,  Carlton   VIC   3053  ",
            lotPlan: null,
            title: null
        );
        var result = PropertyMapper.NormalizeProperty(ext);
        Assert.Equal("10 Example St, Carlton VIC 3053", result.fullAddress);
    }

    [Fact]
    public void PreservesSourceTrace()
    {
        var ext = new ExternalProperty(
            provider: "VIC-DDP",
            requestId: "REQ-12345",
            receivedAt: DateTimeOffset.Parse("2025-08-30T03:12:45Z"),
            addressParts: null,
            formattedAddress: "10 Example St, Carlton VIC 3053",
            lotPlan: new LotPlan("12", "PS123456"),
            title: new Title(null, null)
        );
        var result = PropertyMapper.NormalizeProperty(ext);
        Assert.Equal("VIC-DDP", result.sourceTrace.provider);
        Assert.Equal("REQ-12345", result.sourceTrace.requestId);
        Assert.Equal(DateTimeOffset.Parse("2025-08-30T03:12:45Z"), result.sourceTrace.receivedAt);
    }
}
