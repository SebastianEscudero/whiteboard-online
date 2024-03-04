const LandingLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return ( 
        <main className="h-full bg-[#FFF3D9] overflow-auto">
            <div className="mx-auto h-full w-full">
                {children}
            </div>
        </main>
     );
}
 
export default LandingLayout;