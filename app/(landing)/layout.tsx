const LandingLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return ( 
        <main className= "bg-[#FFF3D9]">
            <div className="mx-auto h-full">
                {children}
            </div>
        </main>
     );
}
 
export default LandingLayout;