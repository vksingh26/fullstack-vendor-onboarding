import axios, { AxiosResponse, AxiosError } from 'axios';

const BASE_URL = 'http://localhost:3000/api';

type Vendor = {
    id?: number;
    name: string;
    contact_person: string;
    email: string;
    partner_type: string;
}

interface EmailCheckResponse {
    exists: boolean;
    message: string;
    vendorName?: string;
}

interface ErrorResponse {
    error: string;
    code?: string;
}

async function testEndpoints(): Promise<void> {
    try {
        console.log('Testing vendor endpoints...\n');

        // Test 1: Check if email exists (should return false for new email)
        console.log('1. Testing email check for new email...');
        const checkNewEmail: AxiosResponse<EmailCheckResponse> = await axios.get(`${BASE_URL}/vendors/check-email/test@example.com`);
        console.log('Response:', checkNewEmail.data);
        console.log('');

        // Test 2: Check if existing email exists (should return true)
        console.log('2. Testing email check for existing email...');
        const checkExistingEmail: AxiosResponse<EmailCheckResponse> = await axios.get(`${BASE_URL}/vendors/check-email/johndoe@test.com`);
        console.log('Response:', checkExistingEmail.data);
        console.log('');

        // Test 3: Try to register vendor with duplicate email (should return 409)
        console.log('3. Testing duplicate email registration...');
        try {
            const duplicateVendor: AxiosResponse<Vendor> = await axios.post(`${BASE_URL}/vendors`, {
                name: 'John Doe',
                contact_person: 'John_Doe',
                email: 'johndoe@test.com', // This email already exists
                partner_type: 'Supplier'
            });
            console.log('Unexpected success:', duplicateVendor.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError<ErrorResponse>;
                if (axiosError.response) {
                    console.log('Expected error response:', axiosError.response.status, axiosError.response.data);
                } else {
                    console.log('Error:', axiosError.message);
                }
            } else {
                console.log('Error:', (error as Error).message);
            }
        }
        console.log('');

        // Test 4: Register vendor with new email (should succeed)
        console.log('4. Testing new vendor registration...');
        const newVendor: AxiosResponse<Vendor> = await axios.post(`${BASE_URL}/vendors`, {
            name: 'New John Doe',
            contact_person: 'New_John_Doe',
            email: 'newjohndoe@test.com',
            partner_type: 'Partner'
        });
        console.log('Success response:', newVendor.status, newVendor.data);
        console.log('');

        // Test 5: Verify the new vendor was added
        console.log('5. Testing email check for newly added vendor...');
        const checkNewVendorEmail: AxiosResponse<EmailCheckResponse> = await axios.get(`${BASE_URL}/vendors/check-email/newjohndoe@test.com`);
        console.log('Response:', checkNewVendorEmail.data);

        // Test 6: Delete the newly added vendor by id
        console.log('\n6. Deleting the newly added vendor...');
        const newVendorId = (newVendor.data as Vendor).id as number;
        const deleteResp = await axios.delete(`${BASE_URL}/vendors/${newVendorId}`);
        console.log('Delete response status:', deleteResp.status);

        // Test 7: Verify deletion (check-email should now be available)
        console.log('7. Verifying deletion via email check...');
        const checkAfterDelete: AxiosResponse<EmailCheckResponse> = await axios.get(`${BASE_URL}/vendors/check-email/newjohndoe@test.com`);
        console.log('Response after delete:', checkAfterDelete.data);

        // Test 8: Deleting again should return 404
        console.log('8. Deleting again should result in 404...');
        try {
            await axios.delete(`${BASE_URL}/vendors/${newVendorId}`);
            console.log('Unexpected success on second delete');
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                console.log('Expected 404 response:', error.response.status, error.response.data);
            } else {
                console.log('Error:', (error as Error).message);
            }
        }

    } catch (error) {
        console.error('Test failed:', (error as Error).message);
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<ErrorResponse>;
            if (axiosError.response) {
                console.error('Response status:', axiosError.response.status);
                console.error('Response data:', axiosError.response.data);
            }
        }
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    testEndpoints();
}

export { testEndpoints };
