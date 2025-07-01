import { Card, CardContent } from "@/components/ui/card"
// const images = Array.from({ length: 7 }, (_, i) => 
//   `/src/assets/images/partners/${i + 1}.png`
// );
import { fetchPageContent } from "../db";
const data = await fetchPageContent("Home");
const partnersImages = data.Partners["src"].map((partner: { image: string }) => partner.image);

export default function Partners() {

return (
    <div className="flex flex-col items-center justify-center bg-white">
      <h2 className="text-5xl lg:text-[56px] font-bebas tracking-wider text-[#212529] font-bold pt-6">Our Partners</h2>
        <Card className="w-full bg-white border-none shadow-none py-0">
            <CardContent className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center">
                <h3 className="text-[16px] m-5">We are proud to partners with:</h3>
            </div>
            <div className="flex items-center flex-wrap justify-center p-1 gap-6">
                {partnersImages.map((image, index) => (
                <div key={index} className="flex items-center w-20 h-20 lg:w-[200px] lg:h-[200px]">
                    <img
                    src={image}
                    alt={`Partner ${index + 1}`}
                    className="object-cover"
                    />
                </div>
                ))}
            </div>
            </CardContent>
        </Card>
    </div>
    
)
}
