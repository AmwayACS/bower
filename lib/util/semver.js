var semver = require('semver');
var mout = require('mout');

function maxSatisfying(versions, range, strictMatch, accCustomMatch) {
    var version;
    var filteredVersions;
    
    // Filter only valid versions, since semver.maxSatisfying() throws an error
    versions = versions.filter(function (version) {
        return semver.valid(version);
    });

    // Exact version & range match
    if (semver.valid(range)) {
        version = mout.array.find(versions, function (version) {
            return version === range;
        });
        if (version) {
            return version;
        }
    }

    range = typeof range === 'string' ? range.trim() : range;

    // When strict match is enabled give priority to non-pre-releases
    // We do this by filtering every pre-release version

    //acc customization
    //if accCustomMatch is enabled, give priority to pre-releases based on environment
    
    //Returns a function that returns true or false based on dv, ts, qa or pd environment
    function accEnvValidVersion(env){
        
        return function(version){
            var parsed = semver.parse(version);
            //If stable auto include
            if (parsed && parsed.prerelease && parsed.prerelease.length == 0) return true;

            if (parsed){
                
                //Valid semver version
                switch (env.toUpperCase()){
                    case "DV" : return true;
                    case "TS" : return !parsed.prerelease[0].startsWith("alpha") //Ignore alphas
                    case "QA" : return parsed.prerelease[0].startsWith("pre") //Ignore alphas
                    case "PD" : return false; //No pre-release version in prod
                }
            }
            return false;
        }
    }

    if (strictMatch) {
        if(accCustomMatch && process.env.ACC_ENV){
            var accEnvFilter = accEnvValidVersion(process.env.ACC_ENV);
            filteredVersions = versions.map(function (version) {
                return accEnvFilter(version) ? version : null;
            });

        } else {
            filteredVersions = versions.map(function (version) {
                return !isPreRelease(version) ? version : null;
            });
        }

        version = semver.maxSatisfying(filteredVersions, range);
        if (version) {
            return version;
        }
    }

    // Fallback to regular semver max satisfies
    return semver.maxSatisfying(versions, range);
}
//acc customization
function maxSatisfyingIndex(versions, range, strictMatch, accCustomMatch) {
    var version = maxSatisfying(versions, range, strictMatch, accCustomMatch);

    if (!version) {
        return -1;
    }

    return versions.indexOf(version);
}

function clean(version) {
    var parsed = semver.parse(version);

    if (!parsed) {
        return null;
    }

    // Keep builds!
    return parsed.version + (parsed.build.length ? '+' + parsed.build.join('.') : '');
}

function isPreRelease(version) {
    var parsed = semver.parse(version);
    return parsed && parsed.prerelease && parsed.prerelease.length;
}

// Export a semver like object but with our custom functions
mout.object.mixIn(module.exports, semver, {
    maxSatisfying: maxSatisfying,
    maxSatisfyingIndex: maxSatisfyingIndex,
    clean: clean,
    valid: clean
});
