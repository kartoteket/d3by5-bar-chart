# Change Log
All notable changes to this project will be documented in this file.
This project adheres (well, maybe not quite) to [Semantic Versioning](http://semver.org/).


## [Unreleased]
### Added
- Added posibility to set anchors ('top' | 'bottom' | 'left' | 'right')
- Added inline labels to match the anchoring
- Added support for grouped bars
- Added support for stacked bars
- Added support for theming (inherited from base chart)
- Added listeners for events on individual bars

### Changed
- More details in the README
- Refactored, creating a single barOptions for positions and dimensions of bars
- Refactored, bar positions as separate class
- Refactored, dimensions as separate class
- renamed ordinal and linear to x and y for all scales and axis
- removed a dependency on the init method. selection can now be injected runtime

### Fixed
- Ensure bar width never goes below 1px
- Fixed an issue with the UMD loader for label options

## [0.0.1] - 2016-06-01
### Added
- Cloned over the pie chart repo and adjusted

### Changed
- Updated README

[//]: ##############################################
<!---
[//]: # (Legend)
[Added]:        <> (for new features.)
[Changed]:      <> (for changes in existing functionality.)
[Deprecated]:   <> (for once-stable features removed in upcoming releases.)
[Removed]:      <> (for deprecated features removed in this release.)
[Fixed]:        <> (for any bug fixes.)
[Security]:     <> (to invite users to upgrade in case of vulnerabilities.)
--->