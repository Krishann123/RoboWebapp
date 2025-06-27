import { Card, CardContent } from "@/components/ui/card"

export default function Partners({ partners }) {
    if (!partners || partners.length === 0) {
        return null; // Don't render anything if there are no partners
    }

return (
        <div className="flex flex-col items-center justify-center bg-white py-12">
            <h2 className="text-5xl lg:text-[56px] font-bebas tracking-wider text-[#212529] font-bold pt-6">Our International Partners</h2>
        <Card className="w-full bg-white border-none shadow-none py-0">
            <CardContent className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center">
                        <h3 className="text-[16px] m-5">We are proud to partner with:</h3>
            </div>
            <div className="flex items-center flex-wrap justify-center p-1 gap-6">
                        {partners.map((partner) => (
                            <a href={partner.url} key={partner._id} target="_blank" rel="noopener noreferrer" className="flex items-center w-20 h-20 lg:w-[200px] lg:h-[200px] transition-transform duration-300 hover:scale-105">
                    <img
                                    src={partner.imageUrl}
                                    alt={partner.name}
                                    title={partner.name}
                                    className="object-contain w-full h-full"
                    />
                            </a>
                ))}
            </div>
            </CardContent>
        </Card>
    </div>
)
}
