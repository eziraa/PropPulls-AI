import { ProtectedRoute } from "@/components/protected.route";
import { AuthProvider } from "@/lib/contexts/auth.context";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <AuthProvider>
            <ProtectedRoute>
                <div className="min-h-screen bg-gray-100">
                    <div className="container mx-auto p-4">
                        {children}
                    </div>
                </div>
            </ProtectedRoute>
        </AuthProvider>
    );
}

export default ProtectedLayout;