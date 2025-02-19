import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    // Variable to track login status (initially set to true)
    let isLoggedIn = request.cookies.get('AccessToken')?.value ? true : false;
    // console.log('isLoggedIn', request.url)
    // // Check if user is logged in
    try{
        if (isLoggedIn) {
            // Allow access to protected routes
            if (request.url.includes('/login') ||
             request.url == 'http://localhost:3000/' ||
    
            
            
            request.url.includes('/register') || request.url.includes('/forgot-password') ){
                const response = await fetch('https://incodocs-server.onrender.com/factory/getfactorybyuser', {
                    headers: {
                        'Authorization': `Bearer ${request.cookies.get('AccessToken')?.value}`, // Add token for authorization if needed
                        'Content-Type': 'application/json',
                    },
                });
    
                if (response.ok) {
                    const factories = await response.json();
    
                    // console.log(factories)
    
                    if (factories && factories.length > 0) {
                        const firstFactoryId = factories[0]?._id; // Adjust based on the response structure
                        return NextResponse.redirect(
                            new URL(`${firstFactoryId}/dashboard`, request.url)
                        );
                    } else {
                        console.warn('No factories found for the user.');
                        return NextResponse.redirect(new URL('/dashboard', request.url));
                    }
              
            }
        }
    
            return NextResponse.next();
        } else {
            // Redirect to login page if not logged in, but allow access to the login page itself
            if (request.url.includes('/login')) {
                return NextResponse.next();
            }
             if (request.url.includes('/register')) {
                return NextResponse.next();
            }
            if (request.url.includes('/forgot-password')) {
                return NextResponse.next();
            }
            if (request.url == 'http://localhost:3000/') {
                return NextResponse.next();
            }
            
            
    
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }
    catch(e){
        console.log(e)
    }
    
}

// Adjust the matcher to target routes within the routes folder
export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
