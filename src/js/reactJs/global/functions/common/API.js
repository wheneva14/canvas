export async function fetchAPI ({src, data, headers}) {
    if(src)
        try{
            let res = await fetch(src, {
                method: 'POST',
                headers: headers || {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body : JSON.stringify(data)
            });
            return await res.json();
        } catch(error) {
            throw error;
        }
}