#!/usr/bin/env node

const fs = require('fs');
const https = require('https');
const http = require('http');

console.log('🚀 Starting Book Club Admin Dashboard End-to-End Test\n');

// Test configuration
const FRONTEND_URL = 'http://localhost:5176';
const BACKEND_URL = 'http://localhost:8000';

// Test Results
const results = {
    apiTests: [],
    frontendTests: [],
    chartTests: [],
    consoleErrors: []
};

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const lib = url.startsWith('https') ? https : http;
        const req = lib.request(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: data
                });
            });
        });
        
        req.on('error', reject);
        req.setTimeout(5000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
        
        req.end();
    });
}

// Test 1: Backend API Endpoints
async function testBackendAPIs() {
    console.log('📡 Testing Backend API Endpoints...');
    
    const endpoints = [
        { name: 'API Root', path: '/api/' },
        { name: 'Admin Stats', path: '/api/admin/stats/' },
        { name: 'Books Analytics', path: '/api/admin/analytics/books/' },
        { name: 'Summaries Analytics', path: '/api/admin/analytics/summaries/' },
        { name: 'Active Clubs Analytics', path: '/api/admin/analytics/active-clubs/' }
    ];
    
    for (const endpoint of endpoints) {
        try {
            const response = await makeRequest(`${BACKEND_URL}${endpoint.path}`);
            const status = response.statusCode;
            const isHealthy = status === 200 || status === 401 || status === 403; // 401/403 means endpoint exists but needs auth
            
            results.apiTests.push({
                name: endpoint.name,
                url: `${BACKEND_URL}${endpoint.path}`,
                status: status,
                passed: isHealthy,
                message: isHealthy ? 'Endpoint accessible' : `HTTP ${status}`
            });
            
            console.log(`  ${isHealthy ? '✅' : '❌'} ${endpoint.name}: HTTP ${status}`);
            
        } catch (error) {
            results.apiTests.push({
                name: endpoint.name,
                url: `${BACKEND_URL}${endpoint.path}`,
                status: 'ERROR',
                passed: false,
                message: error.message
            });
            console.log(`  ❌ ${endpoint.name}: ${error.message}`);
        }
    }
}

// Test 2: Frontend Accessibility
async function testFrontendAccessibility() {
    console.log('\n🌐 Testing Frontend Accessibility...');
    
    try {
        const response = await makeRequest(FRONTEND_URL);
        const isAccessible = response.statusCode === 200;
        
        results.frontendTests.push({
            name: 'Frontend Server',
            url: FRONTEND_URL,
            status: response.statusCode,
            passed: isAccessible,
            message: isAccessible ? 'Frontend accessible' : `HTTP ${response.statusCode}`
        });
        
        console.log(`  ${isAccessible ? '✅' : '❌'} Frontend Server: HTTP ${response.statusCode}`);
        
        // Check if the HTML contains React app elements
        if (isAccessible && response.body.includes('id="root"')) {
            console.log('  ✅ React app root element found');
        } else {
            console.log('  ⚠️  React app root element not found');
        }
        
    } catch (error) {
        results.frontendTests.push({
            name: 'Frontend Server',
            url: FRONTEND_URL,
            status: 'ERROR',
            passed: false,
            message: error.message
        });
        console.log(`  ❌ Frontend Server: ${error.message}`);
    }
}

// Test 3: Chart.js Dependencies
async function testChartJSDependencies() {
    console.log('\n📊 Testing Chart.js Dependencies...');
    
    try {
        // Check package.json for Chart.js dependencies
        const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
        const hasChartJS = packageJson.dependencies && packageJson.dependencies['chart.js'];
        const hasReactChartJS = packageJson.dependencies && packageJson.dependencies['react-chartjs-2'];
        
        results.chartTests.push({
            name: 'Chart.js Package',
            passed: !!hasChartJS,
            message: hasChartJS ? `Version ${hasChartJS}` : 'Not found in dependencies'
        });
        
        results.chartTests.push({
            name: 'React Chart.js 2 Package',
            passed: !!hasReactChartJS,
            message: hasReactChartJS ? `Version ${hasReactChartJS}` : 'Not found in dependencies'
        });
        
        console.log(`  ${hasChartJS ? '✅' : '❌'} Chart.js: ${hasChartJS || 'Not found'}`);
        console.log(`  ${hasReactChartJS ? '✅' : '❌'} React-ChartJS-2: ${hasReactChartJS || 'Not found'}`);
        
    } catch (error) {
        results.chartTests.push({
            name: 'Package.json Check',
            passed: false,
            message: error.message
        });
        console.log(`  ❌ Package.json Check: ${error.message}`);
    }
}

// Test 4: Component Files Existence
async function testComponentFiles() {
    console.log('\n📁 Testing Component Files...');
    
    const files = [
        { name: 'AdminDashboard Component', path: './src/components/AdminDashboard.jsx' },
        { name: 'Analytics Slice', path: './src/features/analytics/analyticsSlice.js' },
        { name: 'Admin API Service', path: './src/services/adminApi.js' }
    ];
    
    for (const file of files) {
        try {
            const exists = fs.existsSync(file.path);
            const content = exists ? fs.readFileSync(file.path, 'utf8') : '';
            
            // Check for Chart.js imports in AdminDashboard
            if (file.name === 'AdminDashboard Component' && exists) {
                const hasChartImports = content.includes('Chart as ChartJS') && content.includes('react-chartjs-2');
                console.log(`  ${exists ? '✅' : '❌'} ${file.name}: ${exists ? 'Found' : 'Missing'}`);
                console.log(`  ${hasChartImports ? '✅' : '❌'} Chart.js imports: ${hasChartImports ? 'Present' : 'Missing'}`);
            } else {
                console.log(`  ${exists ? '✅' : '❌'} ${file.name}: ${exists ? 'Found' : 'Missing'}`);
            }
            
        } catch (error) {
            console.log(`  ❌ ${file.name}: Error reading file`);
        }
    }
}

// Test 5: Generate Test Report
function generateTestReport() {
    console.log('\n📋 Test Summary Report\n');
    console.log('═'.repeat(60));
    
    // API Tests Summary
    console.log('\n🔌 API Endpoints:');
    const apiPassed = results.apiTests.filter(t => t.passed).length;
    const apiTotal = results.apiTests.length;
    console.log(`  Status: ${apiPassed}/${apiTotal} tests passed`);
    
    results.apiTests.forEach(test => {
        console.log(`  ${test.passed ? '✅' : '❌'} ${test.name} - ${test.message}`);
    });
    
    // Frontend Tests Summary
    console.log('\n🌐 Frontend Tests:');
    const frontendPassed = results.frontendTests.filter(t => t.passed).length;
    const frontendTotal = results.frontendTests.length;
    console.log(`  Status: ${frontendPassed}/${frontendTotal} tests passed`);
    
    results.frontendTests.forEach(test => {
        console.log(`  ${test.passed ? '✅' : '❌'} ${test.name} - ${test.message}`);
    });
    
    // Chart.js Tests Summary
    console.log('\n📊 Chart.js Dependencies:');
    const chartPassed = results.chartTests.filter(t => t.passed).length;
    const chartTotal = results.chartTests.length;
    console.log(`  Status: ${chartPassed}/${chartTotal} tests passed`);
    
    results.chartTests.forEach(test => {
        console.log(`  ${test.passed ? '✅' : '❌'} ${test.name} - ${test.message}`);
    });
    
    // Overall Status
    const totalPassed = apiPassed + frontendPassed + chartPassed;
    const totalTests = apiTotal + frontendTotal + chartTotal;
    
    console.log('\n' + '═'.repeat(60));
    console.log(`\n📊 OVERALL RESULTS: ${totalPassed}/${totalTests} tests passed`);
    
    const successRate = Math.round((totalPassed / totalTests) * 100);
    console.log(`   Success Rate: ${successRate}%`);
    
    if (successRate >= 80) {
        console.log('   🎉 DASHBOARD READY FOR TESTING!');
    } else if (successRate >= 60) {
        console.log('   ⚠️  DASHBOARD PARTIALLY READY - Some issues detected');
    } else {
        console.log('   ❌ DASHBOARD NOT READY - Multiple issues need fixing');
    }
    
    console.log('\n💡 Next Steps:');
    console.log('   1. Open browser to http://localhost:5176');
    console.log('   2. Navigate to Admin Dashboard');
    console.log('   3. Verify Chart.js renders correctly');
    console.log('   4. Check browser console for errors');
    console.log('   5. Test with real API data (requires admin authentication)');
}

// Main test execution
async function runAllTests() {
    try {
        await testBackendAPIs();
        await testFrontendAccessibility();
        await testChartJSDependencies();
        await testComponentFiles();
        generateTestReport();
        
        // Save results to file
        fs.writeFileSync('test_results.json', JSON.stringify(results, null, 2));
        console.log('\n💾 Test results saved to test_results.json');
        
    } catch (error) {
        console.error('\n❌ Test execution failed:', error.message);
        process.exit(1);
    }
}

// Check if we're in the right directory
if (!fs.existsSync('./package.json')) {
    console.error('❌ Error: Please run this script from the Client directory');
    console.error('   Expected to find package.json in current directory');
    process.exit(1);
}

// Run the tests
runAllTests();
