interface UserIdPageProps {
    params: {
        userId: string;
    };
};

const Page = ({
    params,
}: UserIdPageProps) => {
    return (
        <div>
            <h1>User {params.userId}</h1>
        </div>
    );
}

export default Page;
